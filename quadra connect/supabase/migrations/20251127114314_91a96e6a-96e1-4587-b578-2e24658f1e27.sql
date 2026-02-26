-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  cpf TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create courts table
CREATE TABLE public.courts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  sport_type TEXT NOT NULL,
  price_per_hour DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  has_parking BOOLEAN DEFAULT false,
  has_locker BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on courts
ALTER TABLE public.courts ENABLE ROW LEVEL SECURITY;

-- Courts policies (public read)
CREATE POLICY "Anyone can view courts"
  ON public.courts FOR SELECT
  USING (true);

-- Create reservations table
CREATE TABLE public.reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  court_id UUID NOT NULL REFERENCES public.courts(id) ON DELETE CASCADE,
  reservation_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  num_players INTEGER NOT NULL CHECK (num_players > 0),
  total_price DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid')),
  amount_paid DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on reservations
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Reservations policies
CREATE POLICY "Users can view their own reservations"
  ON public.reservations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reservations"
  ON public.reservations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reservations"
  ON public.reservations FOR UPDATE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_reservations_updated_at
  BEFORE UPDATE ON public.reservations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, cpf, phone, address, city, state)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'cpf', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'address', ''),
    COALESCE(NEW.raw_user_meta_data->>'city', ''),
    COALESCE(NEW.raw_user_meta_data->>'state', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert 10 sample courts
INSERT INTO public.courts (name, location, city, state, sport_type, price_per_hour, has_parking, has_locker, description) VALUES
('Arena Sports Center', 'Quadra 13 - Lote 14 A 16 - Jardim', 'Anápolis', 'Goiás', 'Tênis', 150.00, true, true, 'Quadra de tênis com estrutura completa e iluminação'),
('Quadra de Parque', 'R. Maria Batista, 363-239', 'Anápolis', 'Goiás', 'Vôlei', 150.00, true, true, 'Quadra de vôlei ao ar livre com arquibancada'),
('Centro Esportivo Premium', 'Av. Brasil, 1234 - Centro', 'Anápolis', 'Goiás', 'Futebol', 200.00, true, true, 'Campo de futebol society com grama sintética'),
('Club Arena Verde', 'Rua das Flores, 567 - Jundiaí', 'Anápolis', 'Goiás', 'Tênis', 180.00, true, true, 'Quadra de tênis coberta com vestiários modernos'),
('Quadra Municipal', 'Praça Central - Setor Sul', 'Goiânia', 'Goiás', 'Basquete', 120.00, true, false, 'Quadra poliesportiva para basquete e vôlei'),
('Sports Complex Gold', 'Av. Goiás, 890 - Setor Oeste', 'Goiânia', 'Goiás', 'Futebol', 250.00, true, true, 'Complexo esportivo com 3 campos e bar'),
('Arena Beach Volley', 'Parque das Águas - Setor Bueno', 'Goiânia', 'Goiás', 'Vôlei de Praia', 140.00, true, true, 'Quadra de vôlei de praia com areia importada'),
('Quadra do Clube', 'Rua 10, 234 - Setor Marista', 'Goiânia', 'Goiás', 'Tênis', 160.00, true, true, 'Clube particular com quadra de tênis e piscina'),
('Centro Olímpico', 'Av. Independência, 456 - Vila Nova', 'Anápolis', 'Goiás', 'Basquete', 130.00, true, true, 'Ginásio coberto com arquibancada para 200 pessoas'),
('Arena Futebol Pro', 'Rodovia BR-153, Km 12', 'Anápolis', 'Goiás', 'Futebol', 220.00, true, true, 'Campo profissional com iluminação e placar eletrônico');